import notFoundImage from './../public/assets/not-found.png'; 

export default function PageNotFound() {
  return (
    <div className='w-full h-screen flex justify-center p-3'>
      <img
        src="/assets/not-found.png" 
        alt="Page not found"
        className="object-contain"
      />
    </div>
  );
}
