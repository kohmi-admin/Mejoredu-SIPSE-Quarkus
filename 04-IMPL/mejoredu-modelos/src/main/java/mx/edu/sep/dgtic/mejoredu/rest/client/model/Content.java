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
public class Content {
	public String mimeType;
	public String mimeTypeName;
	public int sizeInBytes;
	public String encoding;

	@JsonCreator
	public static Content ofContent(@JsonProperty("mimeType") String mimeType,
			@JsonProperty("mimeTypeName") String mimeTypeName, @JsonProperty("sizeInBytes") int sizeInBytes,
			@JsonProperty("encoding") String encoding) {
		return new Content(mimeType, mimeTypeName, sizeInBytes, encoding);
	}

}
