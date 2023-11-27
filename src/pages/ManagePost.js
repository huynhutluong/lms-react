import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useAuth} from "../hooks/useAuth";
import {Dimmer, Loader} from "semantic-ui-react";

const ManagePost = () => {
    let {user} = useAuth();
    let {id} = useParams();
    let [isLoading, setIsLoading] = useState(true)

    async function updateActivities() {
        await fetch(`http://localhost:8080/activities?account_id=${user.account_id}&activity_type=Xem+trang&activity_target=${window.location.pathname}`)
    }

    useEffect(() => {
        Promise.all([updateActivities()]).finally(() => setIsLoading(false))
    }, [])

    return <div>
        {
            isLoading
            ?
                <div>
                    <Dimmer active>
                        <Loader/>
                    </Dimmer>
                </div>
                :
                <div>

                </div>
        }
    </div>;
};

export default ManagePost;