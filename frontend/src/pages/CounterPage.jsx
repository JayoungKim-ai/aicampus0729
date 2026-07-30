import { useState } from "react";

function CounterPage() {
  const [count, setCount] = useState(0);
  const max = 5;
  const min = -5;

  return (
    <div className="flex justify-center mt-20">
      <div className="flex flex-col justify-center p-20 text-[50px] w-150 bg-white">
        <h1 className="text-[100px] text-center">{count}</h1>
        <div className="flex justify-between gap-10 ">
          <button
            className={
              count > min
                ? "bg-blue-100 w-20 rounded-full hover:bg-blue-200"
                : "bg-gray-100 w-20 rounded-full"
            }
            onClick={() => {
              setCount(count - 1);
            }}
            disabled={count <= min}
          >
            -
          </button>
          <button
            className="bg-[#f3f3f3] w-50 pl-5 pr-5 rounded-[10px] hover:bg-[#eee]"
            onClick={() => {
              setCount(0);
            }}
          >
            Reset
          </button>
          <button
            className="bg-blue-500 w-20 rounded-full text-white hover:bg-blue-600"
            onClick={() => {
              setCount(count + 1);
            }}
            disabled={count >= max}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

export default CounterPage;
