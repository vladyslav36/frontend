import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import Loader from "react-loader-spinner"

export default function Spinner() {
  return (
    <div className="spinner">
      <Loader type="BallTriangle" timeout={5000} />
    </div>
  )
}
