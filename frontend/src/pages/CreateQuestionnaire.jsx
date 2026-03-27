import QuestionBuilder from "./QuestionBuilder";
import { useNavigate } from "react-router-dom";

const CreateQuestion = () => {
  const navigate = useNavigate();

  const handleComplete = () => {
    // Go back to list after saving
    navigate("/questions");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <QuestionBuilder onCompleted={handleComplete} />
    </div>
  );
};

export default CreateQuestion;