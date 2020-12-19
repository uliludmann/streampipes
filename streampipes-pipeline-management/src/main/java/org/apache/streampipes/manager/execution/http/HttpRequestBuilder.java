/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

package org.apache.streampipes.manager.execution.http;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import org.apache.http.client.fluent.Request;
import org.apache.http.client.fluent.Response;
import org.apache.http.entity.ContentType;
import org.apache.streampipes.commons.Utils;
import org.apache.streampipes.model.base.InvocableStreamPipesEntity;
import org.apache.streampipes.model.base.NamedStreamPipesEntity;
import org.apache.streampipes.model.pipeline.PipelineElementStatus;
import org.apache.streampipes.serializers.json.JacksonSerializer;
import org.apache.streampipes.serializers.jsonld.JsonLdTransformer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

public class HttpRequestBuilder {

  private NamedStreamPipesEntity payload;
  private String endpointUrl;

  private static final Integer CONNECT_TIMEOUT = 10000;

  private final static Logger LOG = LoggerFactory.getLogger(HttpRequestBuilder.class);

  public HttpRequestBuilder(NamedStreamPipesEntity payload, String endpointUrl) {
    this.payload = payload;
    this.endpointUrl = endpointUrl;
  }

  public PipelineElementStatus invoke() {
    try {
      String json;
      if (payload instanceof InvocableStreamPipesEntity) {
        LOG.info("Invoking pipeline element: " + endpointUrl);
        json = jsonLd();
      } else {
        LOG.info("Invoking data stream relay: " + endpointUrl);
        json = jackson();
      }
      Response httpResp = Request
              .Post(endpointUrl)
              .bodyString(json, ContentType.APPLICATION_JSON)
              .connectTimeout(CONNECT_TIMEOUT)
              .execute();
      return handleResponse(httpResp);
    } catch (Exception e) {
      LOG.error(e.getMessage());
      return new PipelineElementStatus(endpointUrl, payload.getName(), false, e.getMessage());
    }
  }

  public PipelineElementStatus detach() {
    if (payload instanceof InvocableStreamPipesEntity) {
      LOG.info("Detaching pipeline element: " + endpointUrl);
    } else {
      LOG.info("Detaching data stream relay: " + endpointUrl);
    }

    try {
      Response httpResp = Request
              .Delete(endpointUrl)
              .connectTimeout(CONNECT_TIMEOUT)
              .execute();
      return handleResponse(httpResp);
    } catch (Exception e) {
      LOG.error("Could not stop pipeline " + endpointUrl, e.getMessage());
      return new PipelineElementStatus(endpointUrl, payload.getName(), false, e.getMessage());
    }
  }

  private PipelineElementStatus handleResponse(Response httpResp) throws JsonSyntaxException, IOException {
    String resp = httpResp.returnContent().asString();
    org.apache.streampipes.model.Response streamPipesResp = new Gson().fromJson(resp, org.apache.streampipes.model.Response.class);
    return convert(streamPipesResp);
  }

  private String jsonLd() throws Exception {
    return Utils.asString(new JsonLdTransformer().toJsonLd(payload));
  }

  private PipelineElementStatus convert(org.apache.streampipes.model.Response response) {
    return new PipelineElementStatus(endpointUrl, payload.getName(), response.isSuccess(), response.getOptionalMessage());
  }

  private String jackson() throws JsonProcessingException {
    return JacksonSerializer.getObjectMapper().writeValueAsString(payload);
  }
}
