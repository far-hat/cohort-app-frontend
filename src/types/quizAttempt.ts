export type Quiz = {
  quiz_id: number;
  course_name: string;
  quiz_description: string;
  status: string;
  start_datetime?: string;
  end_datetime?: string;
  mentor_id?: number;
};