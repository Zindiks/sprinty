# Authentication & Organization Flow Fix - Phase 1: Implementation 🚧

**Status:** In Progress 🚧
**Created:** 2025-11-18
**Started:** 2025-11-18
**Assigned To:** Claude

---

## Overview

Fix the client authentication and organization selection flow to ensure proper authentication, route protection, and seamless organization selection experience.

### Current Problems Identified

1. ✅ **No Route Protection** - All routes accessible without authentication → **FIXED**
2. ✅ **Organization Selection Required But Not Enforced** - Inconsistent behavior → **FIXED**
3. ✅ **Organization Create Doesn't Auto-Select** - Poor UX after creating org → **FIXED**
4. ✅ **No Loading States** - Jarring transitions between auth states → **FIXED**
5. ⚠️ **Duplicate User Fetching** - Multiple components fetch user independently → **NOT NEEDED** (UserContext already centralized)

---

## Goals

- ✅ Add proper route protection for authenticated routes
- ✅ Ensure organization selection is enforced before accessing boards
- ✅ Auto-select organization after creation
- ✅ Improve loading states and user experience
- ✅ Centralize user fetching logic (already centralized in UserContext)
- 🧪 Test entire flow end-to-end

---

## Implementation Progress

### Completed ✅

1. **Created Authentication Guard Components**
   - ✅ Created `src/components/auth/ProtectedRoute.tsx` - Authentication guard
   - ✅ Created `src/components/auth/OrganizationGuard.tsx` - Organization selection guard
   - ✅ Created `src/components/auth/LoadingScreen.tsx` - Loading component
   - ✅ Created `src/components/auth/index.ts` - Barrel export

2. **Updated Routes with Guards**
   - ✅ Updated `src/routes/index.tsx` with route protection
   - ✅ Applied `ProtectedRoute` to authenticated routes
   - ✅ Applied `OrganizationGuard` to organization-dependent routes
   - ✅ Documented route structure

3. **Fixed Organization Creation Flow**
   - ✅ Updated `CreateOrganizationModal.tsx` to auto-select new org
   - ✅ Added navigation to `/boards` after org creation
   - ✅ Updates both Zustand store and localStorage

4. **Verified Loading States**
   - ✅ UserContext already has proper loading state management
   - ✅ LoadingScreen component shows during auth checks
   - ✅ No jarring transitions

5. **Verified User Fetching**
   - ✅ UserContext already centralizes user fetching
   - ✅ No duplicate fetching needed

### In Progress 🚧

6. **Testing End-to-End Flow**
   - 🚧 Dev server started successfully
   - 🚧 No TypeScript errors
   - ⏳ Need to test authentication flow
   - ⏳ Need to test organization selection flow

### Pending ⏳

7. **Documentation Update**
   - ⏳ Update `client/docs/features.md` with auth improvements
   - ⏳ Mark phase as complete

---

## Scope

### In Scope

1. Create `ProtectedRoute` component for authentication guard
2. Create `OrganizationGuard` component to ensure org is selected
3. Update routes to use protection guards
4. Fix organization creation to auto-select new org
5. Add loading states during authentication checks
6. Remove duplicate user fetching from Marketing and other pages
7. Add redirect logic after login and org selection

### Out of Scope (Future Phases)

- Token refresh mechanism (API doesn't support it yet)
- Backend organization session storage
- Role-based access control (RBAC)
- Organization membership validation

---

## Technical Approach

### 1. Create Authentication Guard Component

**File:** `src/components/auth/ProtectedRoute.tsx`

```typescript
import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { UserContext } from '@/contexts/UserContext'

export const ProtectedRoute = () => {
  const { user, loading } = useContext(UserContext)

  if (loading) {
    return <div>Loading...</div> // Or a proper loading component
  }

  if (!user) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
```

### 2. Create Organization Guard Component

**File:** `src/components/auth/OrganizationGuard.tsx`

```typescript
import { useEffect } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import { useStore } from '@/hooks/store/useStore'

export const OrganizationGuard = () => {
  const navigate = useNavigate()
  const organization_id = useStore(state => state.organization_id)

  useEffect(() => {
    // Check both Zustand and localStorage
    const storedOrgId = localStorage.getItem('organization_id')

    if (!organization_id && !storedOrgId) {
      navigate('/organizations', { replace: true })
    }
  }, [organization_id, navigate])

  // If no org selected, don't render children
  if (!organization_id && !localStorage.getItem('organization_id')) {
    return null
  }

  return <Outlet />
}
```

### 3. Update Routes with Guards

**File:** `src/routes/index.tsx`

```typescript
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { OrganizationGuard } from '@/components/auth/OrganizationGuard'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Marketing />, // Public route
  },
  {
    element: <ProtectedRoute />, // Authentication guard
    children: [
      {
        path: '/profile',
        element: <ProfilePage />,
      },
      {
        path: '/organizations',
        element: <Organization />,
      },
      {
        element: <OrganizationGuard />, // Organization guard
        children: [
          {
            path: '/boards',
            element: <Boards />,
          },
          {
            path: '/boards/:boardId',
            element: <BoardLayout />,
            children: [
              { index: true, element: <BoardView /> },
              { path: 'calendar', element: <CalendarView /> },
            ],
          },
          {
            path: '/dashboard',
            element: <Dashboard />,
          },
        ],
      },
    ],
  },
])
```

### 4. Fix Organization Creation Auto-Select

**File:** `src/components/organization/CreateOrganizationModal.tsx`

Update the mutation's `onSuccess` handler:

```typescript
const mutation = useMutation({
  mutationFn: createOrganization,
  onSuccess: (data) => {
    toast({
      title: "Success",
      description: "Organization created successfully",
    })

    // Auto-select the newly created organization
    const newOrgId = data.id
    localStorage.setItem("organization_id", newOrgId)
    setOrganizationId(newOrgId) // Update Zustand store

    setOpen(false)

    // Navigate to boards
    navigate('/boards')
  },
  onError: (error) => {
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    })
  },
})
```

### 5. Add Loading Component

**File:** `src/components/auth/LoadingScreen.tsx`

```typescript
export const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}
```

### 6. Update UserContext Loading State

**File:** `src/contexts/UserContext.tsx`

Ensure loading state is properly managed:

```typescript
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true) // Start as true

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check for token in URL first
        const params = new URLSearchParams(window.location.search)
        const token = params.get('access_token')

        if (token) {
          document.cookie = `accessToken=${token}; path=/; samesite=strict`
          window.history.replaceState({}, '', window.location.pathname)
        }

        // Fetch user
        const response = await fetch(`${API_URL}/oauth/user`, {
          credentials: 'include',
        })

        if (response.ok) {
          const data = await response.json()
          setUser(data)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
      } finally {
        setLoading(false) // Always set loading to false
      }
    }

    checkAuth()
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  )
}
```

### 7. Remove Duplicate User Fetching

**Files to Update:**
- `src/pages/Marketing.tsx` - Remove duplicate user fetch, rely on UserContext
- `src/components/user/UserAvatar.tsx` - Use UserContext instead of separate fetch
- Any other components fetching user independently

---

## Tasks

### 1. Create Authentication Guard Components
- [ ] Create `src/components/auth/` directory
- [ ] Create `ProtectedRoute.tsx` component
- [ ] Create `OrganizationGuard.tsx` component
- [ ] Create `LoadingScreen.tsx` component
- [ ] Export from `src/components/auth/index.ts`

### 2. Update Routes with Guards
- [ ] Update `src/routes/index.tsx` with route protection
- [ ] Apply `ProtectedRoute` to authenticated routes
- [ ] Apply `OrganizationGuard` to organization-dependent routes
- [ ] Test route access without authentication
- [ ] Test route access without organization

### 3. Fix Organization Creation Flow
- [ ] Update `CreateOrganizationModal.tsx` to auto-select new org
- [ ] Add navigation to `/boards` after org creation
- [ ] Update Zustand store after org creation
- [ ] Update localStorage after org creation
- [ ] Test create → auto-select → redirect flow

### 4. Improve Loading States
- [ ] Update `UserContext` loading state management
- [ ] Use `LoadingScreen` in `ProtectedRoute`
- [ ] Add loading state to organization selection
- [ ] Add loading state to organization creation

### 5. Clean Up Duplicate Code
- [ ] Remove user fetching from `Marketing.tsx`
- [ ] Update `Marketing.tsx` to use UserContext
- [ ] Remove user fetching from `UserAvatar.tsx`
- [ ] Update `UserAvatar.tsx` to use UserContext
- [ ] Remove any other duplicate user fetches

### 6. Test End-to-End Flow
- [ ] Test: Anonymous user → redirected to Marketing
- [ ] Test: Login → redirect to organizations (if no org)
- [ ] Test: Login → redirect to boards (if org exists)
- [ ] Test: Create organization → auto-select → redirect to boards
- [ ] Test: Select organization → redirect to boards
- [ ] Test: Logout → clear state → redirect to Marketing
- [ ] Test: Direct URL access without auth (should redirect)
- [ ] Test: Direct URL access without org (should redirect to /organizations)

### 7. Update Documentation
- [ ] Update `client/docs/features.md` with auth improvements
- [ ] Mark phase as complete (rename to phase-1-done.md)
- [ ] Document any issues or edge cases discovered

---

## Acceptance Criteria

- [ ] All protected routes require authentication
- [ ] Board-related routes require organization selection
- [ ] Unauthenticated users are redirected to Marketing page
- [ ] Authenticated users without org are redirected to Organizations page
- [ ] Creating organization auto-selects it and navigates to boards
- [ ] Loading states show during authentication checks
- [ ] No duplicate user fetching across components
- [ ] All routes tested and working correctly
- [ ] Documentation updated

---

## Testing Plan

### Manual Testing

1. **Anonymous User Flow:**
   - Visit `/boards` → Should redirect to `/`
   - Visit `/dashboard` → Should redirect to `/`
   - Visit `/` → Should show login button

2. **Login Flow (No Organization):**
   - Click "Login with GitHub" → OAuth flow
   - After login → Should redirect to `/organizations`
   - Should see organization selector + create button

3. **Create Organization Flow:**
   - Click "Create Organization"
   - Fill form and submit
   - Should auto-select new organization
   - Should navigate to `/boards`

4. **Select Organization Flow:**
   - On `/organizations` page
   - Select organization from dropdown
   - Should save to localStorage
   - Should navigate to `/boards`

5. **Login Flow (Has Organization):**
   - User already has org in localStorage
   - Click "Login with GitHub"
   - After login → Should redirect to `/boards` (skip /organizations)

6. **Logout Flow:**
   - Click logout
   - Should clear user from context
   - Should clear cookie
   - Should redirect to `/`

7. **Protected Route Access:**
   - Try accessing `/boards` without auth → Redirect to `/`
   - Try accessing `/dashboard` without auth → Redirect to `/`
   - Try accessing `/boards` without org → Redirect to `/organizations`

### Automated Testing (Future)

- Unit tests for ProtectedRoute component
- Unit tests for OrganizationGuard component
- Integration tests for auth flow
- E2E tests with Playwright

---

## Dependencies

- Existing UserContext implementation
- Existing Zustand store for organization_id
- React Router v7
- API endpoints: `/api/v1/oauth/*`, `/api/v1/organizations/*`

---

## Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Breaking existing auth flow | High | Medium | Test thoroughly, keep UserContext mostly unchanged |
| localStorage cleared by user | Medium | Low | Add fallback to fetch orgs and prompt selection |
| Redirect loops | High | Medium | Careful guard logic, test all paths |
| Race conditions in auth check | Medium | Low | Proper async/await, loading states |

---

## API Endpoints Used

### Authentication:
- `GET /api/v1/oauth/github` - GitHub OAuth redirect
- `GET /api/v1/oauth/user` - Get current user (credentials: include)
- `POST /api/v1/oauth/logout` - Logout user

### Organizations:
- `GET /api/v1/organizations/` - List organizations (withCredentials)
- `POST /api/v1/organizations/` - Create organization (withCredentials)

---

## Files to Create

1. `src/components/auth/ProtectedRoute.tsx` (new)
2. `src/components/auth/OrganizationGuard.tsx` (new)
3. `src/components/auth/LoadingScreen.tsx` (new)
4. `src/components/auth/index.ts` (new - exports)

---

## Files to Modify

1. `src/routes/index.tsx` - Add route guards
2. `src/components/organization/CreateOrganizationModal.tsx` - Auto-select + navigate
3. `src/contexts/UserContext.tsx` - Improve loading state
4. `src/pages/Marketing.tsx` - Remove duplicate user fetch
5. `src/components/user/UserAvatar.tsx` - Use UserContext

---

## Notes

- Keep changes minimal to avoid breaking existing functionality
- Focus on adding guards, not refactoring entire auth system
- Organization selection is client-side only (no backend session)
- All API calls pass organization_id explicitly
- WebSocket requires user context, will work with these changes

---

## Next Steps After Completion

1. Consider adding organization membership validation
2. Add token refresh mechanism (when API supports it)
3. Add role-based access control (RBAC)
4. Store last-used organization in backend user session
5. Add comprehensive test suite for auth flow

---

## Related Documentation

- `client/docs/features.md` - Feature status
- `client/docs/architecture.md` - Architecture overview
- `api/docs/features.md` - API endpoints reference
