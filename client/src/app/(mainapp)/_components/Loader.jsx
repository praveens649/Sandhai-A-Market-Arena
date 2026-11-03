const Loader = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
      <div className="w-10 h-10 border-3 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{message}</p>
    </div>
  );
};

export default Loader;
