import { grey } from "@mui/material/colors";

export function Tags(props: { tags: string[] }) {
  return <div className="flex gap-3 justify-center flex-wrap">
    {props.tags.map((tag) => <span
      className="border-2 px-2 py-1 font-semibold text-sm rounded-md shadow-sm text-center"
      key={tag}
      style={{
        backgroundColor: grey[100],
      }}
    >
      {tag}
    </span>)}
  </div>
}