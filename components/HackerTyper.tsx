import { useEffect, useState } from "react";

interface HackerTyperProps {
  text: string;
  mouseOver?: string;
  className?: string;
}


export default function HackerTyper(props: HackerTyperProps) {

  let [written, setWritten] = useState(0);

  let print = () => {
    let output: string = props.text.slice(0, written);
    if (written < props.text.length)
      output += "_";
    return output;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setWritten(written + 1);
    }, 25);

    return () => clearInterval(timer);
  });

  return (
    <div className={props.className}>
      <h1 title={props.mouseOver}>{print()}</h1>
    </div>
  );
}
