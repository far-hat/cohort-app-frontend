export type createCourseType ={
    course_title : string;
    description : string;

}

export type createCohortType = {
    cohort_name : string;
    start_date : Date;
    end_date : Date;
}

export type Course ={
    course_id : string,
    course_title : string,
    description : string,
    status : string,
    created_at : string,
    cohorts : Cohort[],
}

export type Cohort = {
    cohort_id : string,
    cohort_name : string,
    description : string,
    status : string,
    start_date : string,
    end_date : string,
    created_at : string,
}


