import React from 'react'
import { Text } from '@ui-kitten/components'
import shallowCompare from 'react-addons-shallow-compare'

export class ErrorBoundary extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(e) {
    return { hasError: true, error: e }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.hasError && !shallowCompare(prevProps, this.props)) {
      this.setState({ hasError: false, error: null })
    }
  }

  render() {
    if (this.state.hasError) {
      return <Text status="danger">Something went wrong.</Text>
    }

    return this.props.children
  }
}

export default ErrorBoundary
