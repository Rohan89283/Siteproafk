import LoginPage from '../components/LoginPage'

export default function Auth({ onAuthChange }) {
  return <LoginPage onLogin={onAuthChange} />
}
