/*
 * Copyright 2019 FZI Forschungszentrum Informatik
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

//import _ from 'lodash';


import {Inject, Injectable} from "@angular/core";
import * as angular from 'angular';

@Injectable()
export class RestApi {

    AuthStatusService: any;
    $http: any;
    apiConstants: any;
    encodeURIComponent: any;
    
    constructor (@Inject('$http') $http, @Inject('apiConstants') apiConstants, @Inject('AuthStatusService') AuthStatusService) {
        this.AuthStatusService = AuthStatusService;
        this.$http = $http;
        this.apiConstants = apiConstants;
    }

    getServerUrl() {
        return this.apiConstants.contextPath + this.apiConstants.api;
    }

    urlBase() {
        return this.getServerUrl() +'/users/' + this.AuthStatusService.email;
    };

    getAssetUrl(appId) {
        return this.getServerUrl() +"/pe/" +appId +"/assets";
    }

    getFileUrl(appId) {
        return this.getServerUrl() + "/pe/" + appId + "/file"
    }

    getUserDetails() {
        return this.$http.get(this.urlBase());
    }

    updateUserDetails(user) {
        return this.$http.put(this.urlBase(), user);
    }

    getBlocks() {
        return this.$http.get(this.urlBase() + "/block");
    };
    saveBlock(block) {
        return this.$http.post(this.urlBase() + "/block", block);
    };

    getOwnActions() {
        return this.$http.get(this.urlBase() +"/actions/own");
    };

    getAvailableActions() {
        return this.$http.get(this.urlBase() +"/actions/available");
    };

    getPreferredActions() {
        return this.$http.get(this.urlBase() +"/actions/favorites");
    };

    addPreferredAction(elementUri) {
        return this.$http({
            method: 'POST',
            url: this.urlBase() + "/actions/favorites",
            data: $.param({uri: elementUri}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
    }

    removePreferredAction(elementUri) {
        return this.$http({
            method: 'DELETE',
            url: this.urlBase() + "/actions/favorites/" + encodeURIComponent(elementUri)
        })
    }

    getOwnSepas() {
        return this.$http.get(this.urlBase() +"/sepas/own");
    };

    getAvailableSepas() {
        return this.$http.get(this.urlBase() +"/sepas/available");
    };

    getPreferredSepas() {
        return this.$http.get(this.urlBase() +"/sepas/favorites");
    };

    addPreferredSepa(elementUri) {
        return this.$http({
            method: 'POST',
            url: this.urlBase() + "/sepas/favorites",
            data: $.param({uri: elementUri}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
    }

    removePreferredSepa(elementUri) {
        return this.$http({
            method: 'DELETE',
            url: this.urlBase() + "/sepas/favorites/" + encodeURIComponent(elementUri)
        })
    }

    getOwnSources() {
        return this.$http.get(this.urlBase() +"/sources/own");
    };

    getAvailableSources() {
        return this.$http.get(this.urlBase() +"/sources/available");
    };

    getPreferredSources() {
        return this.$http.get(this.urlBase() +"/sources/favorites");
    };

    addPreferredSource(elementUri) {
        return this.$http({
            method: 'POST',
            url: this.urlBase() + "/sources/favorites",
            data: $.param({uri: elementUri}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
    }

    removePreferredSource(elementUri) {
        return this.$http({
            method: 'DELETE',
            url: this.urlBase() + "/sources/favorites/" + encodeURIComponent(elementUri)
        })
    }

    getOwnStreams(source){
        return this.$http.get(this.urlBase() + "/sources/" + encodeURIComponent(source.uri) + "/streams");

    };

    add(elementUri, ispublic) {
        return this.$http({
            method: 'POST',
            url: this.urlBase() + "/element",
            data: $.param({uri: elementUri, publicElement: ispublic}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
    }

    addBatch(elementUris, ispublic) {
        return this.$http({
            method: 'POST',
            url: this.urlBase() + "/element/batch",
            data: $.param({uri: elementUris, publicElement: ispublic}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
    }

    update(elementUri) {
        return this.$http({
            method: 'PUT',
            url: this.urlBase() + "/element/" + encodeURIComponent(elementUri)
        })
    }

    del(elementUri) {
        return this.$http({
            method: 'DELETE',
            url: this.urlBase() + "/element/" + encodeURIComponent(elementUri)
        })
    }

    jsonld(elementUri) {
        return this.$http.get(this.urlBase() +"/element/" + encodeURIComponent(elementUri) +"/jsonld");
    }

    configured() {
        return this.$http.get(this.getServerUrl() + "/setup/configured", {
            ignoreLoadingBar: true,
            timeout: 2000
        });

    }

    getConfiguration() {
        return this.$http.get(this.getServerUrl() +"/setup/configuration");
        //return this.$http.get(this.getServerUrl() +"/semantic-epa-backend/api/v2/setup/configured");
    }

    updateConfiguration(config) {
        return this.$http.put(this.getServerUrl() +"/setup/configuration", config);
        //return this.$http.get(this.getServerUrl() +"/semantic-epa-backend/api/v2/setup/configured");
    };

    getOwnPipelines() {
        return this.$http.get(this.urlBase() +"/pipelines/own");
        //return this.$http.get("/semantic-epa-backend/api/pipelines");
    };

    getSystemPipelines() {
        return this.$http.get(this.urlBase() +"/pipelines/system");
    };

    storePipeline(pipeline) {
        return this.$http.post(this.urlBase() +"/pipelines", pipeline);
    }

    updateStream(stream) {
        return this.$http.post(this.urlBase() +"/streams/update", stream);
    }

    deleteOwnPipeline(pipelineId) {

        // delete all the widgets that use the pipeline results

        // this.$http.get("/dashboard/_all_docs?include_docs=true").then(function(data) {
        //     var toDelete = _.chain(data.data.rows)
        //         .filter(function(o) {
        //             return o.doc.visualisation.pipelineId == pipelineId;
        //         }).value();

            // _.map(toDelete, function(o) {
            //     this.$http.delete("/dashboard/" + o.doc._id + '?rev=' + o.doc._rev);
            // });

        // });

        return this.$http({
            method: 'DELETE',
            url: this.urlBase() + "/pipelines/" +pipelineId
        });
    }

    getPipelineCategories() {
        return this.$http.get(this.urlBase() +"/pipelinecategories");
    };

    storePipelineCategory(pipelineCategory) {
        return this.$http.post(this.urlBase() +"/pipelinecategories", pipelineCategory);
    };

    deletePipelineCategory(categoryId) {
        return this.$http({
            method: 'DELETE',
            url: this.urlBase() + "/pipelinecategories/" +categoryId
        });
    }

    fetchRemoteOptions(resolvableOptionsParameterRequest) {
        return this.$http.post(this.urlBase() +"/pe/options", resolvableOptionsParameterRequest);
    }

    recommendPipelineElement(pipeline) {
        return this.$http.post(this.urlBase() +"/pipelines/recommend", pipeline);
    }

    updatePartialPipeline(pipeline) {
        return this.$http.post(this.urlBase() +"/pipelines/update", pipeline, {
            ignoreLoadingBar: true
        });
    }

    updateDataSet(dataSet) {
        return this.$http.post(this.urlBase() +"/pipelines/update/dataset", dataSet);
    }

    startPipeline(pipelineId) {
        return this.$http.get(this.urlBase() +"/pipelines/" +pipelineId +"/start");
    }

    stopPipeline(pipelineId) {
        return this.$http.get(this.urlBase() +"/pipelines/" +pipelineId +"/stop");
    }

    getPipelineById(pipelineId) {
        return this.$http.get(this.urlBase() + "/pipelines/" + pipelineId);
    }

    getPipelineStatusById(pipelineId) {
        return this.$http.get(this.urlBase() + "/pipelines/" + pipelineId +"/status");
    }

    updatePipeline(pipeline){
        var pipelineId = pipeline._id;
        return this.$http.put(this.urlBase() + "/pipelines/" + pipelineId, pipeline);
    }

    getNotifications() {
        return this.$http.get(this.urlBase() +"/notifications");
    }

    getUnreadNotifications() {
        return this.$http.get(this.urlBase() +"/notifications/unread");
    }

    updateNotification(notificationId) {
        return this.$http.put(this.urlBase() +"/notifications/" +notificationId);
    }

    deleteNotifications(notificationId) {
        return this.$http({
            method: 'DELETE',
            url: this.urlBase() + "/notifications/" +notificationId
        });
    }

    getSepaById(elementId) {
        return this.$http.get(this.urlBase() +"/sepas/" + encodeURIComponent(elementId));
    }

    getActionById(elementId) {
        return this.$http.get(this.urlBase() +"/actions/" + encodeURIComponent(elementId));
    };

    getOntologyProperties() {
        return this.$http.get( this.getServerUrl() + "/ontology/properties");
    };

    getOntologyPropertyDetails(propertyId) {
        return this.$http.get(this.getServerUrl() + "/ontology/properties/" + encodeURIComponent(propertyId));
    }

    addOntologyProperty(propertyData) {
        return this.$http.post(this.getServerUrl() + "/ontology/properties", propertyData);
    }

    getOntologyConcepts() {
        return this.$http.get(this.getServerUrl() + "/ontology/types");
    };

    getOntologyConceptDetails(conceptId) {
        return this.$http.get(this.getServerUrl() + "/ontology/types/" + encodeURIComponent(conceptId));
    }

    getOntologyNamespaces() {
        return this.$http.get(this.getServerUrl() + "/ontology/namespaces");
    }

    addOntologyNamespace(namespace) {
        return this.$http.post(this.getServerUrl() + "/ontology/namespaces", namespace);
    }

    deleteOntologyNamespace(prefix) {
        return this.$http({
            method: 'DELETE',
            url: this.getServerUrl() + "/ontology/namespaces/" + encodeURIComponent(prefix)
        });
    }

    addOntologyConcept(conceptData) {
        return this.$http.post(this.getServerUrl() + "/ontology/types", conceptData);
    }

    addOntologyInstance(instanceData) {
        return this.$http.post(this.getServerUrl() + "/ontology/instances", instanceData);
    }

    getOntologyInstanceDetails(instanceId) {
        return this.$http.get(this.getServerUrl() + "/ontology/instances/" + encodeURIComponent(instanceId));
    }

    updateOntologyProperty(propertyId, propertyData) {
        return this.$http.put(this.getServerUrl() + "/ontology/properties/" + encodeURIComponent(propertyId), propertyData);
    }

    updateOntologyConcept(conceptId, conceptData) {
        return this.$http.put(this.getServerUrl() + "/ontology/types/" + encodeURIComponent(conceptId), conceptData);
    }

    updateOntologyInstance(instanceId, instanceData) {
        return this.$http.put(this.getServerUrl() + "/ontology/instances/" + encodeURIComponent(instanceId), instanceData);
    }

    deleteOntologyInstance(instanceId) {
        return this.$http({
            method: 'DELETE',
            url: this.getServerUrl() + "/ontology/instances/" + encodeURIComponent(instanceId)
        });
    }

    deleteOntologyProperty(propertyId) {
        return this.$http({
            method: 'DELETE',
            url: this.getServerUrl() + "/ontology/properties/" + encodeURIComponent(propertyId)
        });
    }

    deleteOntologyConcept(conceptId) {
        return this.$http({
            method: 'DELETE',
            url: this.getServerUrl() + "/ontology/types/" + encodeURIComponent(conceptId)
        });
    }

    getAvailableContexts() {
        return this.$http.get(this.getServerUrl()+ "/contexts");
    };

    deleteContext(contextId) {
        return this.$http({
            method: 'DELETE',
            url: this.getServerUrl() + "/contexts/" + encodeURIComponent(contextId)
        });
    }

    getDomainKnowledgeItems(query) {
        return this.$http.post(this.getServerUrl() + "/autocomplete/domain", query);
    };


    getSepasFromOntology() {
        return this.$http.get(this.getServerUrl() + "/ontology/sepas")
    }

    getSepaDetailsFromOntology(uri, keepIds) {
        return this.$http.get(this.getServerUrl() + "/ontology/sepas/" + encodeURIComponent(uri) +"?keepIds=" +keepIds);
    }

    getSourcesFromOntology() {
        return this.$http.get(this.getServerUrl() + "/ontology/sources")
    }

    getSourceDetailsFromOntology(uri, keepIds) {
        return this.$http.get(this.getServerUrl() + "/ontology/sources/" + encodeURIComponent(uri) +"?keepIds=" +keepIds);
    }

    getActionsFromOntology() {
        return this.$http.get(this.getServerUrl() + "/ontology/actions")
    }

    getActionDetailsFromOntology(uri, keepIds) {
        return this.$http.get(this.getServerUrl() + "/ontology/actions/" + encodeURIComponent(uri) +"?keepIds=" +keepIds);
    }

    getRunningVisualizations() {
        return this.$http.get(this.getServerUrl() + "/visualizations");
    }

    getAllUnits() {
        return this.$http.get(this.getServerUrl() + "/units/instances");
    }

    getAllUnitTypes() {
        return this.$http.get(this.getServerUrl() + "/units/types");
    }

    getUnit(resource) {
        return this.$http.get(this.getServerUrl() + "/units/instances/" + encodeURIComponent(resource));
    }

    getEpaCategories() {
        return this.$http.get(this.getServerUrl() + "/categories/epa");
    }

    getEcCategories() {
        return this.$http.get(this.getServerUrl() + "/categories/ec");
    }

    getEpCategories() {
        return this.$http.get(this.getServerUrl() + "/categories/ep");
    }

    getAdapterCategories() {
        return this.$http.get(this.getServerUrl() + "/categories/adapter");
    }

    getAvailableApps(elementId) {
        return this.$http.get(this.urlBase() +"/marketplace");
    }

    installApp(bundleInfo) {
        return this.$http.post(this.urlBase() +"/marketplace/install", bundleInfo);
    }

    uninstallApp(bundleInfo) {
        return this.$http.post(this.urlBase() +"/marketplace/uninstall", bundleInfo);
    }

    getTargetPods() {
        return this.$http.get(this.urlBase() +"/marketplace/pods");
    }

    getRdfEndpoints() {
        return this.$http.get(this.urlBase() +"/rdfendpoints");
    }

    getRdfEndpointItems() {
        return this.$http.get(this.urlBase() +"/rdfendpoints/items");
    }

    addRdfEndpoint(rdfEndpoint) {
        return this.$http.post(this.urlBase() +"/rdfendpoints", rdfEndpoint);
    }

    removeRdfEndpoint(rdfEndpointId) {
        return this.$http.delete(this.urlBase() +"/rdfendpoints/" +rdfEndpointId);
    }

    getAuthc() {
        return this.$http.get(this.getServerUrl() + "/admin/authc");
    }

    login(credentials) {
        return this.$http.post(this.getServerUrl() + "/admin/login", credentials);
    }

    loginSso(credentials, componentId, sessionId) {
        return this.$http.post(this.getServerUrl() + "/admin/login/" +componentId +"?session=" +sessionId, credentials);
    }

    logout() {
        return this.$http.get(this.getServerUrl() + "/admin/logout");
    }

    setupInstall(setup, installationStep) {
        return this.$http.post(this.getServerUrl() + "/setup/install/" +installationStep, setup);
    }

    register(payload) {
        return this.$http.post(this.getServerUrl() +"/admin/register", payload);
    }

    deployStorm(payload) {
        return this.$http({method: 'GET', responseType : 'arraybuffer', headers: {'Accept' : 'application/zip'}, url: this.urlBase() + '/deploy/storm'})

    }

    getApplicationLinks() {
        return this.$http.get(this.getServerUrl() + "/applink");
    };

    getRuntimeInfo(dataStream) {
        return this.$http.post(this.urlBase() +"/pipeline-element/runtime", dataStream, {
            ignoreLoadingBar: true
        });
    }

    getDocumentation(appId) {
        return this.$http.get(this.getAssetUrl(appId) +"/documentation");
    }

    uploadFile(data) {
        return this.$http.post(this.urlBase() + "/files", data, {headers: {'Content-Type': undefined },
            transformRequest: angular.identity});
    }

    getFileMetadata() {
        return this.$http.get(this.urlBase() + "/files");
    }
}

//RestApi.$inject = ['$http', 'apiConstants', 'AuthStatusService'];
