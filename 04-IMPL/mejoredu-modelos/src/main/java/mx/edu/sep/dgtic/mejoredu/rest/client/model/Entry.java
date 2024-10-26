package mx.edu.sep.dgtic.mejoredu.rest.client.model;

import java.util.Date;

import io.quarkus.runtime.annotations.RegisterForReflection;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@RegisterForReflection
public class Entry {

	public String id;
	public String name;
	public String nodeType;
	public boolean isFolder;
	public boolean isFile;
	public boolean isLocked;
	public Date modifiedAt;
	public ModifiedByUser modifiedByUser;
	public Date createdAt;
	public CreatedByUser createdByUser;
	public String parentId;
	public Content content;

}
