// import { Link as LinkImpl} from "react-router-dom";

const LinkImpl = "a";

export default function Link({ href, ...props }) {
  return <LinkImpl href={href} {...props} />;
}
