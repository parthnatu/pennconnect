load csv from "file:///nodes.csv" as line
create (:User {user_graph_id : line[0]});
