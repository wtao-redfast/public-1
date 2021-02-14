import {res2json, jiraSearch} from './addon'
import moment from 'moment'

export default class JiraSprint {
	constructor (sprintId) {
		this.sprintId = sprintId;
	}

  async init(){
    this.details = res2json(
      await AP.request(`rest/agile/1.0/sprint/${this.sprintId}`)
    );

    let res = await jiraSearch(
			`"sprint" = "${this.sprintId}"`
		  );
		this.issues = res.issues;
  }

  exportDailyActivity() {
    let startDate = moment(this.details.startDate);
    let endDate = moment(this.details.endDate);
    let deltaDays = Math.ceil(moment.duration(endDate.diff(startDate)).asDays()) + 1;
    let dates = Array.apply(0, Array(deltaDays))
                    .map((_, index) => startDate.add(1, "days").format('MM/DD'));
    let startDay = Math.floor(Math.random() * 7);
    let endDay = Math.floor(Math.random() * (7 - startDay)) + startDay;
    let issues = this.issues.map(issue => [issue.key, startDay, endDay]);
    return {dates, issues}
  }
}
