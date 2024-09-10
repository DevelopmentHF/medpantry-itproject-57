interface LogEntryProps {
    id: number;
    box: number;
    sku: string;
    proposedQuantityToAdd: number;
    pending: boolean;
    accepted: boolean;
  }


export default function LogEntry({ id, box, sku, proposedQuantityToAdd, pending, accepted } : LogEntryProps) {
    return (
        <>
        <div className="log-entry">
            <p>ID: {id}</p>
            <p>Box: {box}</p>
            <p>SKU: {sku}</p>
            <p>Proposed Quantity: {proposedQuantityToAdd}</p>
            <p>Pending: {pending ? "Yes" : "No"}</p>
            <p>Accepted: {accepted ? "Yes" : "No"}</p>
        </div>
        </>
    )
}