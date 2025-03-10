// Components
const LoadingSpinner: React.FC = () => (
  <div className="max-w-md mx-auto overflow-hidden md:max-w-2xl p-6 mt-10">
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-12 h-12 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
    </div>
  </div>
);

export default LoadingSpinner;
