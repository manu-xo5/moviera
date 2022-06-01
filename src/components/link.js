import LinkImpl from 'next/link';

export default function Link({ href, ...props }) {
  return (
    <LinkImpl href={href} {...props}>
      <a {...props} />
    </LinkImpl>
  );
}
