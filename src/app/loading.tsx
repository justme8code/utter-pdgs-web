export default function Loading({className}:{className?:string}) {
    return (
        <div className={`animate-spin rounded-full  border-t-4 border-blue-500 ${className}`} />

    );
}
