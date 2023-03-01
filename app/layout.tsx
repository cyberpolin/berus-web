import "@/styles/normalize.css"
import "@/styles/skeleton.css"
import "@/styles/root.sass"
export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{props.children}</body>
    </html>
  )
}
