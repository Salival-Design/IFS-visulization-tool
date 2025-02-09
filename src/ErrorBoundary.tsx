import { Component, ErrorInfo, ReactNode } from 'react'
import { Html } from '@react-three/drei'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }
  
  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Visualization Error:', error, info)
  }

  render() {
    return this.state.error ? (
      <Html center>
        <div className="error">
          <h2>Visualization Failed</h2>
          <pre>{this.state.error.message}</pre>
          <button onClick={() => this.setState({ error: null })}>
            Try Again
          </button>
        </div>
      </Html>
    ) : this.props.children
  }
}