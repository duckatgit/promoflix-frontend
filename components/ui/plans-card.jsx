// import { Button } from "@/components/ui/button";
// import { LoadingSpinner } from "./spinner";

// const PlansCard = ({
//   usedQuota,
//   name,
//   price,
//   billing_period,
//   extra_videos_cost,
//   quantity,
//   handleCheckoutPlan,
//   plan_id,
//   loading,
//   userId,
//   highlighted,
//   cancelPlan,
//   usedQuota2,
//   quantity2,
//   isFree,
// }) => {
//   console.log(isFree, "lllllll");
//   const handleButtonClick = () => {
//     if (highlighted) {
//       cancelPlan(); // Call cancelPlan for highlighted plans
//     } else {
//       handleCheckoutPlan(plan_id); // Call handleCheckoutPlan for other plans
//     }
//   };
//   const quota3 = 0;

//   return (
//     <div
//       className={` flex flex-col justify-between items-center w-[270px] border rounded-[10px] h-full ${
//         highlighted ? "border-[#E7680F]" : "border-[#D9D9D9]"
//       }`}
//     >
//       <div>
//         <div className="bg-[#FFFAF6] p-4 m-4">
//           <p className="text-center text-[24px] font-medium mb-4">{name}</p>
//           <p className="text-[#B3B3B3] ">
//             <span className="text-4xl text-black font-bold">
//               <sup className="text-[22px] text-black">$</sup> {price}
//             </span>{" "}
//             / <span> {billing_period} </span>
//           </p>
//           <p className="text-[#B3B3B3] my-4">
//             {highlighted ? usedQuota : 0}/{quantity} used{" "}
//           </p>

//           <div className="my-4 h-4">
//             {highlighted && (
//               <div className="w-full h-2 bg-[#F5F5F5] rounded-full relative">
//                 <div
//                   className="h-2 bg-[#E7680F] rounded-full"
//                   style={{
//                     width: `${highlighted ? (usedQuota / quantity) * 100 : 0}%`,
//                   }}
//                 ></div>
//               </div>
//             )}
//           </div>

       
//         </div>

//         <div className="p-4 mx-8">
//           <ul className="list-disc text-[#757575]">
//             <li>Clone your face & voice</li>
//             <li>{`${quantity} videos a month`}</li>
//             <li>{`${extra_videos_cost}$ per extra video`}</li>
//             <li>{`${quantity2} variable quota`}</li>
//           </ul>
//         </div>
//       </div>

//       <div className="text-center p-4">
//         {!isFree && (
//           <Button
//             className={`py-2 px-3 cursor-pointer rounded-[8px] text-base w-[204px] ${
//               highlighted ? "bg-red-500 text-white hover:bg-red-600" : ""
//             }`}
//             onClick={handleButtonClick}
//           >
//             {loading && userId === plan_id ? (
//               <>
//                 {highlighted ? "Cancelling..." : "Processing..."}
//                 <LoadingSpinner className="ml-2 text-white" />
//               </>
//             ) : highlighted ? (
//               "Cancel Plan"
//             ) : (
//               "Buy"
//             )}
//           </Button>
//         )}

//         {isFree && (
//           <Button className="bg-transparent border text-[#E7680F] border-[#E7680F] ">
//             Current Plan
//           </Button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PlansCard;





import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "./spinner";

const PlansCard = ({
  usedQuota,
  name,
  price,
  billing_period,
  extra_videos_cost,
  quantity,
  handleCheckoutPlan,
  plan_id,
  loading,
  userId,
  highlighted,
  cancelPlan,
  usedQuota2,
  quantity2,
  isFree,
}) => {
  // const handleButtonClick = () => {
  //   handleCheckoutPlan(plan_id); // Call handleCheckoutPlan for Buy button
  // };
  const handleButtonClick = () => {
    if (highlighted) {
      cancelPlan(); // Call cancelPlan for highlighted plans
    } else {
      handleCheckoutPlan(plan_id); // Call handleCheckoutPlan for other plans
    }
  };

  return (
    <div
      className={`flex flex-col justify-between items-center w-[270px] border rounded-[10px] h-full ${
        isFree && highlighted ? "border-[#E7680F]" : "border-[#D9D9D9]"
      }`}
    >
      <div>
        <div className="bg-[#FFFAF6] p-4 m-4">
          <p className="text-center text-[24px] font-medium mb-4">{name}</p>
          <p className="text-[#B3B3B3] ">
            <span className="text-4xl text-black font-bold">
              <sup className="text-[22px] text-black">$</sup> {price}
            </span>{" "}
            / <span> {billing_period} </span>
          </p>
          <p className="text-[#B3B3B3] my-4">
            {highlighted ? usedQuota : 0}/{quantity} used
          </p>

          <div className="my-4 h-4">
            {highlighted  && (
              <div className="w-full h-2 bg-[#F5F5F5] rounded-full relative">
                <div
                  className="h-2 bg-[#E7680F] rounded-full"
                  style={{
                    width: `${(usedQuota / quantity) * 100}%`,
                  }}
                ></div>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 mx-8">
          <ul className="list-disc text-[#757575]">
            <li>Clone your face & voice</li>
            <li>{`${quantity} videos a month`}</li>
            <li>{`${extra_videos_cost}$ per extra video`}</li>
            <li>{`${quantity2} variable quota`}</li>
          </ul>
        </div>
      </div>

      <div className="text-center p-4">
        {isFree && highlighted ? (
          <Button className="bg-transparent border text-[#E7680F] border-[#E7680F] hover:bg-transparent">
            Current Plan
          </Button>
        ) : (
          <Button
            className={`py-2 px-3 cursor-pointer rounded-[8px] text-base w-[204px] ${
              highlighted ? "bg-red-500 text-white hover:bg-red-600" : ""
            }`}
            onClick={handleButtonClick}
          >
            {loading && userId === plan_id ? (
              <>
                {highlighted ? "Cancelling..." : "Processing..."}
                <LoadingSpinner className="ml-2 text-white" />
              </>
            ) : highlighted ? (
              "Cancel Plan"
            ) : (
              "Buy"
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default PlansCard;















   {/* <p className="text-[#B3B3B3] my-4">
            {highlighted ? usedQuota2 : 0}/{quantity2} Varable used{" "}
          </p>

          {highlighted && (
            <div className="my-4">
              <div className="w-full h-2 bg-[#F5F5F5] rounded-full relative">
                <div
                  className="h-2 bg-[#E7680F] rounded-full"
                  style={{
                    width: `${highlighted ? (usedQuota2 / quantity2) * 100 : 0}%`,
                  }}
                ></div>
              </div>
            </div>
          )} */}