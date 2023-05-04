import { useQuery } from "@apollo/client"
import { GET_POST } from "./login/queries.gql"

const PrivacyPolicy = () => {
  const { data, error, loading } = useQuery(GET_POST, {
    variables: {
      id: "2f74c05d-5105-478d-bf37-65626fe7b620",
    },
  })
  if (loading) {
    return (
      <div className="flex h-56 w-56 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
        <div className="animate-pulse rounded-full bg-blue-200 px-3 py-1 text-center text-xs font-medium leading-none text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          loading...
        </div>
      </div>
    )
  }
  if (data?.post) {
    return (
      <>
        <h1>{data?.post?.title}</h1>
        {/* {
          //@ts-ignore
          data.post.content.map((x) => (
            <div
              dangerouslySetInnerHTML={{
                __html: x,
              }}
            ></div>
          ))
        } */}
      </>
    )
  }
}

export default PrivacyPolicy
