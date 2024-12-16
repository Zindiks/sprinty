import { FastifyRequest, FastifyReply } from "fastify";
import { githubCallback, getUser, logout } from "./controller";
import { getAccessTokenFromAuthorizationCodeFlow, fetchUserData } from "./service";

jest.mock("./service");

describe("OAuth Controller", () => {
  let request: Partial<FastifyRequest>;
  let reply: Partial<FastifyReply>;

  beforeEach(() => {
    request = {};
    reply = {
      setCookie: jest.fn(),
      redirect: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      clearCookie: jest.fn(),
    };
  });

  describe("githubCallback", () => {
    it("should set access token cookie and redirect", async () => {
      const token = { access_token: "test_token" };
      (getAccessTokenFromAuthorizationCodeFlow as jest.Mock).mockResolvedValue({ token });

      await githubCallback(request as FastifyRequest, reply as FastifyReply);

      expect(reply.setCookie).toHaveBeenCalledWith("accessToken", token.access_token, expect.any(Object));
      expect(reply.redirect).toHaveBeenCalledWith(`http://localhost:5173?access_token=${token.access_token}`);
    });
  });

  describe("getUser", () => {
    it("should return user data if access token is valid", async () => {
      request.cookies = { accessToken: "test_token" };
      const userData = { id: 1, name: "Test User" };
      (fetchUserData as jest.Mock).mockResolvedValue(userData);

      await getUser(request as FastifyRequest, reply as FastifyReply);

      expect(reply.send).toHaveBeenCalledWith(userData);
    });

    it("should return 401 if access token is missing", async () => {
      request.cookies = {};

      await getUser(request as FastifyRequest, reply as FastifyReply);

      expect(reply.status).toHaveBeenCalledWith(401);
      expect(reply.send).toHaveBeenCalledWith({ error: "Unauthorized" });
    });

    it("should return 500 if fetching user data fails", async () => {
      request.cookies = { accessToken: "test_token" };
      (fetchUserData as jest.Mock).mockResolvedValue(null);

      await getUser(request as FastifyRequest, reply as FastifyReply);

      expect(reply.status).toHaveBeenCalledWith(500);
      expect(reply.send).toHaveBeenCalledWith({ error: "Failed to fetch user data" });
    });
  });

  describe("logout", () => {
    it("should clear access token cookie and return 200", async () => {
      await logout(request as FastifyRequest, reply as FastifyReply);

      expect(reply.clearCookie).toHaveBeenCalledWith("accessToken", { path: "/" });
      expect(reply.status).toHaveBeenCalledWith(200);
      expect(reply.send).toHaveBeenCalledWith({ message: "Logged out" });
    });
  });
});
