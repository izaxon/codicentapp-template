import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
   children: ReactNode;
   fallback?: ReactNode;
}

interface State {
   hasError: boolean;
   error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
   constructor(props: Props) {
      super(props);
      this.state = {
         hasError: false,
         error: null
      };
   }

   static getDerivedStateFromError(error: Error): State {
      // Update state so the next render will show the fallback UI
      return { hasError: true, error };
   }

   componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
      // You can log the error to an error reporting service
      console.error('Error caught by ErrorBoundary:', error);
      console.error('Component stack:', errorInfo.componentStack);
   }

   render(): ReactNode {
      if (this.state.hasError) {
         // You can render any custom fallback UI
         return this.props.fallback || (
            <div style={{
               padding: '20px',
               margin: '20px',
               border: '1px solid #f5c2c7',
               borderRadius: '5px',
               backgroundColor: '#f8d7da',
               color: '#842029'
            }}>
               <h2>Something went wrong</h2>
               <p>The application encountered an error. Please try refreshing the page.</p>
               <details style={{ whiteSpace: 'pre-wrap', margin: '10px 0' }}>
                  <summary>Error Details</summary>
                  {this.state.error?.toString()}
               </details>
               <button
                  onClick={() => window.location.reload()}
                  style={{
                     padding: '8px 16px',
                     backgroundColor: '#0d6efd',
                     color: 'white',
                     border: 'none',
                     borderRadius: '4px',
                     cursor: 'pointer'
                  }}
               >
                  Refresh Page
               </button>
            </div>
         );
      }

      return this.props.children;
   }
}

export default ErrorBoundary;
