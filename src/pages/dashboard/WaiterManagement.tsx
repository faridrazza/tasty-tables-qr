import { useWaiterManagement } from "@/hooks/useWaiterManagement";
import { WaiterForm } from "@/components/waiter/WaiterForm";
import { WaiterList } from "@/components/waiter/WaiterList";

const WaiterManagement = () => {
  const { waiters, isLoadingWaiters, isLoading, createWaiter, deleteWaiter } = useWaiterManagement();

  const handleSubmit = async (data: { name: string; email: string; password: string }) => {
    await createWaiter(data);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Add New Waiter</h2>
        <WaiterForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Waiter List</h2>
        <WaiterList
          waiters={waiters}
          isLoading={isLoadingWaiters}
          onDelete={(id) => deleteWaiter.mutate(id)}
          isDeleting={deleteWaiter.isPending}
        />
      </div>
    </div>
  );
};

export default WaiterManagement;