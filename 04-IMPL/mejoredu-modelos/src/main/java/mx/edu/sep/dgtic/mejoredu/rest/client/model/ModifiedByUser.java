package mx.edu.sep.dgtic.mejoredu.rest.client.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import io.quarkus.runtime.annotations.RegisterForReflection;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@RegisterForReflection
public class ModifiedByUser {

	public String id;
	public String displayName;

	@JsonCreator
	public static ModifiedByUser of(@JsonProperty("id") String id, @JsonProperty("displayName") String displayName) {
		return new ModifiedByUser(id, displayName);
	}
}
