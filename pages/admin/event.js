import AdminEvent from '../../src/components/AdminEvent'
import Layout from '../../src/common/Layout'
import WithAuth from '../../src/hoc/WithAuth'

const AdminEventPage = () => {
  return (
    <Layout>
      <AdminEvent />
    </Layout>
  )
}

export const getServerSideProps = WithAuth(async () => {
  return {
    props: {}
  }
})
export default AdminEventPage
