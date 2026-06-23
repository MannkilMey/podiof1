import { isNative } from '../hooks/usePlatform';

export default function BackButton({ onClick, children, className }) {
  if (isNative) return null;
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
}