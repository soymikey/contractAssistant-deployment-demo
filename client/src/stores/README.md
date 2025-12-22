# State Management - Zustand Stores

This directory contains all Zustand stores for the Contract Assistant application.

## 📁 Structure

```
stores/
├── authStore.ts       # Authentication state management
├── contractStore.ts   # Contract and analysis data management
├── uploadStore.ts     # File upload state management
├── uiStore.ts        # Global UI state (loading, toasts, errors)
└── index.ts          # Exports all stores and initialization
```

## 🚀 Usage

### Basic Usage

```typescript
import { useAuthStore, useContractStore, useUIStore, useUploadStore } from '@/stores';

function MyComponent() {
  // Access state
  const user = useAuthStore((state) => state.user);
  const contracts = useContractStore((state) => state.contracts);
  const isLoading = useUIStore((state) => state.isLoading);

  // Access actions
  const login = useAuthStore((state) => state.login);
  const fetchContracts = useContractStore((state) => state.fetchContracts);
  const showToast = useUIStore((state) => state.showToast);

  // Use them
  const handleLogin = async () => {
    try {
      await login('user@example.com', 'password');
      showToast('success', '登录成功');
    } catch (error) {
      showToast('error', '登录失败');
    }
  };

  return (
    // Your component JSX
  );
}
```

### Selecting Multiple Values

```typescript
// Using multiple selectors
const { user, token, isAuthenticated } = useAuthStore((state) => ({
  user: state.user,
  token: state.token,
  isAuthenticated: state.isAuthenticated,
}));
```

### Using Actions Outside Components

```typescript
import { showSuccessToast, showErrorToast } from '@/stores';

// In service files or utility functions
export async function someAction() {
  try {
    // Do something
    showSuccessToast('操作成功');
  } catch (error) {
    showErrorToast('操作失败');
  }
}
```

## 🎯 Store Details

### AuthStore

Manages authentication state including user info, tokens, login/logout.

**State:**

- `user`: Current user object
- `token`: JWT access token
- `refreshToken`: Refresh token
- `isAuthenticated`: Authentication status
- `isLoading`: Loading state
- `error`: Error message

**Actions:**

- `login(email, password)`: Login user
- `register(email, password, name)`: Register new user
- `logout()`: Logout and clear session
- `refreshAuth()`: Refresh authentication token
- `setUser(user)`: Update user info
- `setToken(token, refreshToken)`: Set tokens manually

**Persistence:** User data and tokens are persisted to AsyncStorage.

### ContractStore

Manages contracts, analysis results, and favorites.

**State:**

- `contracts`: Array of contracts
- `currentContract`: Currently selected contract
- `currentAnalysis`: Analysis data for current contract
- `favorites`: Array of favorited contract IDs
- `isLoading`: Loading state
- `error`: Error message

**Actions:**

- `fetchContracts()`: Fetch all contracts
- `fetchContractById(id)`: Fetch specific contract
- `fetchAnalysis(contractId)`: Fetch analysis for contract
- `addContract(contract)`: Add new contract
- `updateContract(id, updates)`: Update contract
- `deleteContract(id)`: Delete contract
- `toggleFavorite(contractId)`: Add/remove from favorites

**Persistence:** Favorites are persisted to AsyncStorage.

### UploadStore

Manages file upload progress and state.

**State:**

- `files`: Array of upload files
- `currentUpload`: Currently uploading file
- `isUploading`: Upload in progress flag

**Actions:**

- `addFile(file)`: Add file to upload queue
- `removeFile(id)`: Remove file from queue
- `updateFileProgress(id, progress)`: Update upload progress
- `updateFileStatus(id, status, error)`: Update file status
- `setCurrentUpload(file)`: Set currently uploading file
- `clearCompleted()`: Clear completed uploads
- `clearAll()`: Clear all uploads

### UIStore

Manages global UI state including loading indicators, toasts, and errors.

**State:**

- `isLoading`: Global loading state
- `loadingMessage`: Loading message text
- `error`: Global error message
- `toasts`: Array of toast notifications
- `isConnected`: Network connection status

**Actions:**

- `setLoading(isLoading, message)`: Set loading state
- `setError(error)`: Set error message
- `showToast(type, message, duration)`: Show toast notification
- `hideToast(id)`: Hide specific toast
- `clearToasts()`: Clear all toasts
- `setConnectionStatus(isConnected)`: Update connection status

**Helper Functions:**

- `showSuccessToast(message, duration)`
- `showErrorToast(message, duration)`
- `showWarningToast(message, duration)`
- `showInfoToast(message, duration)`

## 🔄 Initialization

Initialize stores on app startup to restore persisted state:

```typescript
import { initializeStores } from '@/stores';

// In your App.tsx or _layout.tsx
useEffect(() => {
  initializeStores();
}, []);
```

## 📝 Design Alignment

The stores are designed to align with the English UI mockup in `contract-assistant-ui.html`:

- **AuthStore**: Supports user login/registration for the Profile screen
- **ContractStore**: Powers the Home screen's contract list and analysis results
  - Mock data includes: "Employment_Contract_2025.pdf", "Purchase_Agreement_001.png", "Lease_Agreement.docx"
  - Analysis data includes contract overview, risks (Vague Termination Compensation, Excessive Confidentiality Period), and recommendations
- **UploadStore**: Manages the upload flow from camera/file picker
- **UIStore**: Controls loading spinners (Screen 2: "Analyzing contract content"), toasts, and network status notifications

### Color Theme Integration

The stores support the app's purple-blue gradient theme (`#667eea` to `#764ba2`):

- Toast types map to the color system (success, error, warning, info)
- Risk levels (high/medium/low) correspond to the risk badge colors

## 🧪 Testing

Mock data is included in `contractStore.ts` for development and testing purposes. Replace mock implementations with actual API calls in the service layer.

## 📚 Resources

- [Zustand Documentation](https://docs.pmnd.rs/zustand)
- [AsyncStorage Documentation](https://react-native-async-storage.github.io/async-storage/)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
