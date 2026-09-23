import AxiosService from './axios';
import AuthAPI from '../core/auth';
import UserAPI from '../core/user';
import AccountAPI from '../core/account';
import StorageAPI from '../core/storage';
import WorkspaceAPI from '../core/workspace';
import ProgramsAPI from '../core/programs';
import CoursesAPI from '../core/courses';
import EnrollAPI from '../core/enroll';

class APIClient {
    public auth: AuthAPI;
    public user: UserAPI;
    public account: AccountAPI;
    public storage: StorageAPI;
    public workspace: WorkspaceAPI;
    public programs: ProgramsAPI;
    public courses: CoursesAPI;
    public enroll: EnrollAPI;

    constructor() {
        const axiosService = new AxiosService();
        this.auth = new AuthAPI(axiosService);
        this.user = new UserAPI(axiosService);
        this.account = new AccountAPI(axiosService);
        this.storage = new StorageAPI(axiosService);
        this.workspace = new WorkspaceAPI(axiosService);
        this.programs = new ProgramsAPI(axiosService);
        this.courses = new CoursesAPI(axiosService);
        this.enroll = new EnrollAPI(axiosService);
    }
}

/** App-wide API client. */
export const OnaekoAPI = new APIClient();
