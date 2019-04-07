/*
 * Copyright 2017 FZI Forschungszentrum Informatik
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.streampipes.processors.filters.jvm.processor.textfilter;

import org.streampipes.model.DataProcessorType;
import org.streampipes.model.graph.DataProcessorDescription;
import org.streampipes.model.graph.DataProcessorInvocation;
import org.streampipes.model.schema.PropertyScope;
import org.streampipes.sdk.builder.ProcessingElementBuilder;
import org.streampipes.sdk.builder.StreamRequirementsBuilder;
import org.streampipes.sdk.extractor.ProcessingElementParameterExtractor;
import org.streampipes.sdk.helpers.EpRequirements;
import org.streampipes.sdk.helpers.Labels;
import org.streampipes.sdk.helpers.Options;
import org.streampipes.sdk.helpers.OutputStrategies;
import org.streampipes.sdk.helpers.SupportedFormats;
import org.streampipes.sdk.helpers.SupportedProtocols;
import org.streampipes.sdk.utils.Assets;
import org.streampipes.wrapper.standalone.ConfiguredEventProcessor;
import org.streampipes.wrapper.standalone.declarer.StandaloneEventProcessingDeclarer;

public class TextFilterController extends StandaloneEventProcessingDeclarer<TextFilterParameters> {

  private static final String KEYWORD_ID = "keyword";
  private static final String OPERATION_ID = "operation";
  private static final String MAPPING_PROPERTY_ID = "text";

  @Override
  public DataProcessorDescription declareModel() {
    return ProcessingElementBuilder.create("org.streampipes.processors.filters.jvm.textfilter", "Text Filter", "Text Filter Description")
            .providesAssets(Assets.DOCUMENTATION, Assets.ICON)
            .category(DataProcessorType.FILTER)
            .requiredStream(StreamRequirementsBuilder
                    .create()
                    .requiredPropertyWithUnaryMapping(EpRequirements
                    .stringReq(), Labels.from(MAPPING_PROPERTY_ID, "Select Text Property", ""), PropertyScope.NONE)
                    .build())
            .requiredSingleValueSelection(Labels.from(OPERATION_ID, "Select Operation", ""), Options.from("MATCHES", "CONTAINS"))
            .requiredTextParameter(Labels.from(KEYWORD_ID, "Select Keyword", ""), "text")
            .outputStrategy(OutputStrategies.keep())
            .supportedFormats(SupportedFormats.jsonFormat())
            .supportedProtocols(SupportedProtocols.kafka(), SupportedProtocols.jms())
            .build();
  }

  @Override
  public ConfiguredEventProcessor<TextFilterParameters> onInvocation
          (DataProcessorInvocation sepa, ProcessingElementParameterExtractor extractor) {

    String keyword = extractor.singleValueParameter(KEYWORD_ID, String.class);
    String operation = extractor.selectedSingleValue(OPERATION_ID, String.class);
    String filterProperty = extractor.mappingPropertyValue(MAPPING_PROPERTY_ID);

    logger.info("Text Property: " + filterProperty);

    TextFilterParameters staticParam = new TextFilterParameters(sepa,
            keyword,
            StringOperator.valueOf(operation),
            filterProperty);

    return new ConfiguredEventProcessor<>(staticParam, TextFilter::new);
  }
}
