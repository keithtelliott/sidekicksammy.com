import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import TenantCell from 'src/components/TenantCell'
const DemoPage = ({title}) => {
  return (
    <>
      <MetaTags title="Demo" description="Demo page" />

      <TenantCell title={title} />
    </>
  )
}

export default DemoPage
