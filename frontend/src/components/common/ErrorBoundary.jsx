import { Component } from 'react';
import { AlertCircle } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null 
    };
  }

  // This lifecycle method is called after an error has been thrown by a descendant component.
  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI.
    return { 
      hasError: true, 
      error 
    };
  }

  // This lifecycle method is called after an error has been thrown.
  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
          <div className="text-center bg-white p-10 rounded-xl shadow-2xl max-w-lg">
            
            {/* Error Icon */}
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            
            {/* Header */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Something went wrong
            </h1>
            
            {/* Message */}
            <p className="text-gray-600 mb-6">
              We're sorry for the inconvenience. Please try refreshing the page.
              {/* Optionally display error details for debugging */}
              {/* <pre className="mt-4 text-xs text-red-400 whitespace-pre-wrap">{this.state.error?.message}</pre> */}
            </p>
            
            {/* Refresh Button */}
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition duration-150"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    // If no error, render the child components
    return this.props.children;
  }
}

export default ErrorBoundary;