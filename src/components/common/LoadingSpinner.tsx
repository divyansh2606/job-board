interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
}

const LoadingSpinner = ({ size = 'medium' }: LoadingSpinnerProps) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className="flex justify-center items-center">
      <div className={`animate-spin rounded-full border-t-2 border-b-2 border-blue-600 ${sizeClasses[size]}`}></div>
    </div>
  );
};

export default LoadingSpinner;