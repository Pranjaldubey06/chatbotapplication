import React, { useEffect, useState } from "react";
import { checkHeading, replaceHeadingStarts } from "../constants/Helper";

const Answers = ({ ans,totalResult, index }) => {
  const [heading, setHeading] = useState(false);
  const [answer, setAnswer] = useState(ans);

  useEffect(() => {
    if (checkHeading(ans)) {
      setHeading(true);
      setAnswer(replaceHeadingStarts(ans));
    }
  }, []);

  console.log(ans, index);
  return (
    <div>
      {index==0 && totalResult >1 ?(
        <span className="pt-2 text-lg font-bold  block">{answer}</span>
      ) : heading ? 
        <span className={"py-2 text-lg font-bold block"}>{answer}</span>
       : 
        <span className="pl-5">{answer}</span>
      }
    </div>
  );
};

export default Answers;
