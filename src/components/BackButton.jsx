import { isNative } from '../hooks/usePlatform';

export default function BackButton({ onClick, children, className }) {
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
}