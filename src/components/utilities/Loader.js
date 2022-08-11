import { useEffect, useState } from "react";
import SkewLoader from "react-spinners/SkewLoader";
import "./utilities.scss";

export default function Loader() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
  }, []);

  return (
    <div className="loader">
      {loading && (
        <SkewLoader color={"#ae8625"} loading={loading} size={40} className='loader__icon' />
      )}
    </div>
  );
}
