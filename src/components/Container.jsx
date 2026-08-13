export default function Container({ as: Tag = 'div', className = '', children, ...props }) {
  return (
    <Tag className={`container-grid ${className}`} {...props}>
      {children}
    </Tag>
  );
}
