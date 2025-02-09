import { Component } from 'react'
import { Html } from '@react-three/drei'

export default class ErrorBoundary extends Component {
  state = { error: null }
  
  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
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