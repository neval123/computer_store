import {makeStyles} from "@material-ui/core/styles";
import Pagination from "@mui/material/Pagination";

const useStyles = makeStyles(() => ({
    ul: {
        "& .MuiPaginationItem-root": {
            color: "#fff"
        }
    }
}));
export default function CustomizedPagination({ totalPages, onPageChange }) {
    const classes = useStyles();

    const handlePageChange = (event, page) => {
        onPageChange(page);
    };

    return (
        <Pagination
            classes={{ ul: classes.ul }}
            count={totalPages}
            onChange={handlePageChange}
            showFirstButton={true}
            showLastButton={true}
        />
    );
}