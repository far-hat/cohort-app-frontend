import { useNavigate } from "react-router-dom";
import {QuestionsForm,QuestionData} from "../../forms/quizforms/QuestionsForm"

const QuestionPage = () => {
    const navigate = useNavigate();
    const handleSave = async (data: QuestionData) => {
  try {
    // await api.save(data);
    console.log("Question saved",data);
    navigate("/mentor");
  } catch (error) {
    console.error("Failed to save questions", error);
  }
};
    return(
        <QuestionsForm onSave={handleSave}/>
    )
}
export default QuestionPage;