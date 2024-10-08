import React from 'react'
import { Alert } from 'antd';
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
    // You can also log error messages to an error reporting service here
  }

  render() {
    if (this.state.errorInfo) {
      // Error path
      return (
        <div style={{ padding: 10 }}>
          <Alert
            message={this.props.fallback || "Something Went Wrong!"}
            description={
              <details style={{ whiteSpace: 'pre-wrap' }}>
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo.componentStack}
              </details>
            }
            type="error"
            showIcon
          // banner
          />

        </div>
      );
    }
    // Normally, just render children
    return this.props.children;
  }
}



export default ErrorBoundary