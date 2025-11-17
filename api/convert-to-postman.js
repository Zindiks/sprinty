const fs = require("fs");
const path = require("path");

// Read the swagger.json file
const swaggerPath = path.join(__dirname, "swagger.json");
const swagger = JSON.parse(fs.readFileSync(swaggerPath, "utf8"));

// Extract base URL from servers
const baseUrl =
  swagger.servers && swagger.servers[0]
    ? swagger.servers[0].url
    : "http://localhost:4000";

// Helper function to convert OpenAPI schema to Postman example
function schemaToExample(schema, components = {}) {
  if (!schema) return {};

  // Handle $ref
  if (schema.$ref) {
    const refPath = schema.$ref.replace("#/components/schemas/", "");
    const refSchema = components.schemas?.[refPath];
    if (refSchema) {
      return schemaToExample(refSchema, components);
    }
    return {};
  }

  // Handle allOf
  if (schema.allOf) {
    const result = {};
    schema.allOf.forEach((item) => {
      Object.assign(result, schemaToExample(item, components));
    });
    return result;
  }

  // Handle array
  if (schema.type === "array") {
    if (schema.items) {
      return [schemaToExample(schema.items, components)];
    }
    return [];
  }

  // Handle object
  if (schema.type === "object") {
    const result = {};
    if (schema.properties) {
      Object.keys(schema.properties).forEach((key) => {
        const prop = schema.properties[key];
        result[key] = schemaToExample(prop, components);
      });
    }
    return result;
  }

  // Handle primitives
  switch (schema.type) {
    case "string":
      if (schema.format === "uuid")
        return "00000000-0000-0000-0000-000000000000";
      if (schema.format === "date-time") return new Date().toISOString();
      if (schema.enum) return schema.enum[0];
      return schema.example || "string";
    case "number":
    case "integer":
      return schema.example || 0;
    case "boolean":
      return schema.example || false;
    default:
      return schema.example || null;
  }
}

// Helper function to convert OpenAPI parameter to Postman variable
function convertParameter(param, components) {
  const postmanParam = {
    key: param.name,
    value: "",
    description: param.description || "",
    disabled: !param.required,
  };

  if (param.schema) {
    if (param.schema.type === "string" && param.schema.format === "uuid") {
      postmanParam.value = "{{uuid}}";
    } else if (param.schema.example !== undefined) {
      postmanParam.value = param.schema.example;
    } else if (param.schema.type === "string") {
      postmanParam.value = "string";
    } else if (
      param.schema.type === "integer" ||
      param.schema.type === "number"
    ) {
      postmanParam.value = "0";
    }
  }

  return postmanParam;
}

// Convert OpenAPI path to Postman request
function convertPathToRequest(path, method, operation, components, baseUrl) {
  // Build path parts and track variables
  const pathParts = path.split("/").filter((p) => p);
  const pathVariables = [];
  let rawPath = path;

  // Convert parameters
  if (operation.parameters) {
    operation.parameters.forEach((param) => {
      if (param.in === "path") {
        // Replace {param} with :param in path
        rawPath = rawPath.replace(`{${param.name}}`, `:${param.name}`);
        const pathIndex = pathParts.findIndex((p) => p === `{${param.name}}`);
        if (pathIndex !== -1) {
          pathParts[pathIndex] = `:${param.name}`;
        }
        pathVariables.push({
          key: param.name,
          value: param.schema?.format === "uuid" ? "{{uuid}}" : "",
          description: param.description || "",
        });
      }
    });
  }

  const request = {
    name:
      operation.summary ||
      operation.description ||
      `${method.toUpperCase()} ${path}`,
    request: {
      method: method.toUpperCase(),
      header: [],
      url: {
        raw: `${baseUrl}${rawPath}`,
        host: [baseUrl.replace(/^https?:\/\//, "").split(":")[0]],
        path: pathParts,
        query: [],
      },
      body: {},
    },
    response: [],
  };

  // Add path variables if any
  if (pathVariables.length > 0) {
    request.request.url.variable = pathVariables;
  }

  // Add description
  if (operation.description) {
    request.request.description = operation.description;
  }

  // Convert non-path parameters
  if (operation.parameters) {
    operation.parameters.forEach((param) => {
      if (param.in === "query") {
        request.request.url.query.push(convertParameter(param, components));
      } else if (param.in === "header") {
        request.request.header.push(convertParameter(param, components));
      }
    });
  }

  // Convert request body
  if (operation.requestBody) {
    const content = operation.requestBody.content;
    if (content["application/json"]) {
      request.request.body = {
        mode: "raw",
        raw: JSON.stringify(
          schemaToExample(content["application/json"].schema, components),
          null,
          2
        ),
        options: {
          raw: {
            language: "json",
          },
        },
      };
      request.request.header.push({
        key: "Content-Type",
        value: "application/json",
        type: "text",
      });
    } else if (content["multipart/form-data"]) {
      request.request.body = {
        mode: "formdata",
        formdata: [],
      };
      const schema = content["multipart/form-data"].schema;
      if (schema && schema.properties) {
        Object.keys(schema.properties).forEach((key) => {
          const prop = schema.properties[key];
          request.request.body.formdata.push({
            key: key,
            value: "",
            type:
              prop.type === "string" && prop.format === "binary"
                ? "file"
                : "text",
            description: prop.description || "",
          });
        });
      }
    }
  }

  // Add response examples
  if (operation.responses) {
    Object.keys(operation.responses).forEach((statusCode) => {
      const response = operation.responses[statusCode];
      const responseExample = {
        name: `${statusCode} - ${response.description || "Response"}`,
        originalRequest: {
          method: method.toUpperCase(),
          header: [],
          url: {
            raw: `${baseUrl}${rawPath}`,
            host: [baseUrl.replace(/^https?:\/\//, "").split(":")[0]],
            path: pathParts,
          },
        },
        status: statusCode,
        code: parseInt(statusCode),
        _postman_previewlanguage: "json",
        header: [
          {
            key: "Content-Type",
            value: "application/json",
          },
        ],
        body: "",
      };

      if (response.content && response.content["application/json"]) {
        const example = schemaToExample(
          response.content["application/json"].schema,
          components
        );
        responseExample.body = JSON.stringify(example, null, 2);
      }

      request.response.push(responseExample);
    });
  }

  return request;
}

// Group requests by tags
function groupByTags(paths, components, baseUrl) {
  const tagMap = {};

  Object.keys(paths).forEach((path) => {
    Object.keys(paths[path]).forEach((method) => {
      const operation = paths[path][method];
      const tags = operation.tags || ["default"];

      tags.forEach((tag) => {
        if (!tagMap[tag]) {
          tagMap[tag] = [];
        }

        const request = convertPathToRequest(
          path,
          method,
          operation,
          components,
          baseUrl
        );
        tagMap[tag].push(request);
      });
    });
  });

  return tagMap;
}

// Create Postman collection
function createPostmanCollection(swagger) {
  const tagMap = groupByTags(swagger.paths, swagger.components, baseUrl);

  const items = Object.keys(tagMap)
    .sort()
    .map((tag) => ({
      name: tag.charAt(0).toUpperCase() + tag.slice(1),
      item: tagMap[tag],
    }));

  // Add health check endpoint if it exists
  if (swagger.paths["/health"]) {
    items.unshift({
      name: "Health",
      item: [
        convertPathToRequest(
          "/health",
          "get",
          swagger.paths["/health"].get || {},
          swagger.components,
          baseUrl
        ),
      ],
    });
  }

  // Add metrics endpoint if it exists
  if (swagger.paths["/metrics"]) {
    items.push({
      name: "Metrics",
      item: [
        convertPathToRequest(
          "/metrics",
          "get",
          swagger.paths["/metrics"].get || {},
          swagger.components,
          baseUrl
        ),
      ],
    });
  }

  const collection = {
    info: {
      name: swagger.info.title || "API Collection",
      description: swagger.info.description || "",
      schema:
        "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
      _exporter_id: "swagger-to-postman",
    },
    item: items,
    variable: [
      {
        key: "baseUrl",
        value: baseUrl,
        type: "string",
      },
      {
        key: "uuid",
        value: "00000000-0000-0000-0000-000000000000",
        type: "string",
      },
    ],
  };

  return collection;
}

// Generate the collection
const collection = createPostmanCollection(swagger);

// Write to file
const outputPath = path.join(__dirname, "Sprinty_API.postman_collection.json");
fs.writeFileSync(outputPath, JSON.stringify(collection, null, 2), "utf8");

console.log(`✅ Postman collection created: ${outputPath}`);
console.log(`📊 Total endpoints: ${Object.keys(swagger.paths).length}`);
console.log(
  `📁 Total folders: ${
    Object.keys(groupByTags(swagger.paths, swagger.components, baseUrl)).length
  }`
);
