/**
 * Container — wraps content in the project grid container.
 *
 * Usage:
 *   <Container>…</Container>
 *   <Container as="section" className="py-16">…</Container>
 *
 * Row / Column helpers (use inside Container):
 *   <div className="row">
 *     <div className="col-12 col-md-6 col-lg-4">…</div>
 *   </div>
 */
export default function Container({ as: Tag = 'div', className = '', children, ...props }) {
  return (
    <Tag className={`container-grid ${className}`} {...props}>
      {children}
    </Tag>
  );
}
