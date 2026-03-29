import dynamic from 'next/dynamic'

const Dashboard = dynamic(() => import('./sections/Dashboard'), {
  ssr: false,
  loading: () => (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'hsl(220 25% 7%)',
      color: 'hsl(220 15% 85%)',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 40, height: 40,
          border: '3px solid hsl(220 15% 20%)',
          borderTopColor: 'hsl(220 80% 55%)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 16px',
        }} />
        <p style={{ fontSize: 14, opacity: 0.6 }}>Loading JobIntel AI...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    </div>
  ),
})

export default function Page() {
  return <Dashboard />
}
