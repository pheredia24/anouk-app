import ExerciseOrderList from './exercise/ExerciseOrderList';

export default function AdminPanel() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-2xl font-bold text-center mb-8">Admin Panel</h1>
        <ExerciseOrderList />
      </div>
    </div>
  );
}
