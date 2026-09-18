<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\AiAdvisorController;

/**
 * The public chat and recommender endpoints are identical for API consumers, so
 * this controller reuses the web implementation rather than duplicating it.
 */
class AiController extends AiAdvisorController {}
