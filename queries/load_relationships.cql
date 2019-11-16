using periodic commit 800
load csv from "file:///edges.csv" as line
match (a:User),(b:User)
where a.user_graph_id = line[0] AND b.user_graph_id = line[1]
create (a)-[r:IS_FRIEND_OF]->(b);
