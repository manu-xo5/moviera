import { Link as LinkImpl } from "react-router-dom";

export default function Link({ href, ...props }) {
  return <LinkImpl to={href} {...props} />;
}
